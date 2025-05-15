import React, { useState, useEffect } from 'react';
import { 
  Text, 
  Input, 
  Button, 
  Badge, 
  Card, 
  CardHeader, 
  makeStyles, 
  tokens, 
  Dropdown, 
  Option, 
  SelectionEvents
} from '@fluentui/react-components';
import { Send24Regular, Delete24Regular } from '@fluentui/react-icons';
import { useAppData } from '../contexts/AppDataContext';
import { ChatMessage } from '../features/chat/types';
import { ExtendedStation } from '../contexts/AppDataContext';

// Custom styles using Fluent UI makeStyles
const useStyles = makeStyles({
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 200px)',
    marginBottom: '20px',
  },
  messagesList: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '8px',
  },
  messageItem: {
    marginBottom: '12px',
    padding: '10px',
    borderRadius: '8px',
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  receivedMessage: {
    backgroundColor: tokens.colorNeutralBackground3,
    alignSelf: 'flex-start',
  },
  broadcastMessage: {
    backgroundColor: tokens.colorNeutralBackground4,
    marginLeft: '10%',
    marginRight: '10%',
    maxWidth: '80%',
    textAlign: 'center',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: tokens.fontSizeBase200,
    marginBottom: '4px',
  },
  messageContent: {
    wordBreak: 'break-word',
  },
  timestamp: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  deletedMessage: {
    fontStyle: 'italic',
    color: tokens.colorNeutralForeground3,
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
  },
  messageInput: {
    flex: 1,
  },
  stationSelector: {
    width: '100%',
    marginBottom: '12px',
  },
  labelText: {
    marginBottom: '6px',
    display: 'block',
  },
  badge: {
    marginLeft: '8px',
  },
  deleteButton: {
    marginLeft: '8px',
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',
    '&:hover': {
      color: tokens.colorNeutralForeground2,
    },
  },
  controlsCard: {
    marginBottom: '16px',
    padding: '12px',
  },
  threadContainer: {
    marginLeft: '24px',
    borderLeft: `2px solid ${tokens.colorNeutralStroke2}`,
    paddingLeft: '16px',
    marginTop: '8px',
  },
  noMessages: {
    textAlign: 'center',
    margin: '30px 0',
    color: tokens.colorNeutralForeground3,
  },
  unreadIndicator: {
    backgroundColor: tokens.colorStatusDangerBackground2,
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '8px',
  }
});

export const ChatPage: React.FC = () => {
  const styles = useStyles();
  const { 
    stations, 
    sendMessage, 
    deleteMessage, 
    getMessagesForStation, 
    getBroadcastMessages,
    markMessageAsRead,
    currentEvent
  } = useAppData();
  
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [recipientStationId, setRecipientStationId] = useState<string | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const [availableStations, setAvailableStations] = useState<ExtendedStation[]>([]);

  // On component mount and when stations/messages change
  useEffect(() => {
    console.log('All stations before filtering:', stations.map(s => ({
      id: s.id,
      name: s.name,
      memberCount: s.member_count || (s.members?.length || 0)
    })));
    
    // Filter available stations (only those with assigned members)
    // We need to check both members array length and member_count because either might be used
    let stationsWithMembers = stations.filter(station => {
      const hasMembersArray = station.members && Array.isArray(station.members) && station.members.length > 0;
      const hasMemberCount = station.member_count && station.member_count > 0;
      return hasMembersArray || hasMemberCount;
    });
    
    // If no stations have members, show all stations as a fallback
    if (stationsWithMembers.length === 0) {
      console.log('No stations with members found, showing all stations');
      stationsWithMembers = [...stations];
    }
    
    console.log('Stations available for chat:', stationsWithMembers.map(s => ({
      id: s.id,
      name: s.name,
      memberCount: s.member_count || (s.members?.length || 0)
    })));
    
    setAvailableStations(stationsWithMembers);
    
    // If no station is selected and we have stations available, select the first one
    if (!selectedStationId && stationsWithMembers.length > 0) {
      const idToSelect = String(stationsWithMembers[0].id);
      console.log('Auto-selecting station:', idToSelect, stationsWithMembers[0].name);
      setSelectedStationId(idToSelect);
    }
  }, [stations, selectedStationId]);

  // Load messages whenever the selected station changes
  useEffect(() => {
    if (selectedStationId) {
      console.log('Loading messages for station:', selectedStationId);
      
      // Get both private messages for this station and broadcast messages
      const stationMessages = getMessagesForStation(selectedStationId);
      const broadcastMessages = getBroadcastMessages();
      
      // Combine and sort by timestamp
      const allMessages = [...stationMessages, ...broadcastMessages]
        .filter((message, index, self) => 
          // Remove duplicates (broadcast messages might appear in both arrays)
          index === self.findIndex(m => m.id === message.id)
        )
        .sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      
      console.log(`Found ${allMessages.length} messages for station ${selectedStationId}`);
      setDisplayedMessages(allMessages);
      
      // Mark unread messages as read
      allMessages.forEach(message => {
        if (!message.read && message.recipient_station_id === selectedStationId) {
          markMessageAsRead(message.id);
        }
      });
    } else {
      setDisplayedMessages([]);
    }
  }, [selectedStationId, currentEvent.chat, getMessagesForStation, getBroadcastMessages, markMessageAsRead]);

  // Handle station change
  const handleStationChange = (event: SelectionEvents, data: { selectedOptions: string[] }) => {
    if (data.selectedOptions.length > 0) {
      const selectedId = String(data.selectedOptions[0]);
      console.log('Selected station ID in handler:', selectedId);
      console.log('Available stations:', availableStations.map(s => ({ id: s.id, name: s.name })));
      
      const selectedStation = stations.find(s => String(s.id) === selectedId);
      console.log('Found station:', selectedStation);
      
      // Always use string IDs for consistency
      setSelectedStationId(selectedId);
      setRecipientStationId(null); // Reset recipient when sender changes
    }
  };

  // Handle recipient station change
  const handleRecipientChange = (event: SelectionEvents, data: { selectedOptions: string[] }) => {
    if (data.selectedOptions.length > 0 && data.selectedOptions[0] !== 'broadcast') {
      // Always use string IDs for consistency 
      setRecipientStationId(String(data.selectedOptions[0]));
    } else {
      setRecipientStationId(null); // null means broadcast
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedStationId) return;
    
    sendMessage({
      sender_station_id: selectedStationId,
      recipient_station_id: recipientStationId,
      message: messageText.trim(),
      thread_id: Date.now().toString(), // New thread ID for top-level messages
    });
    
    setMessageText('');
  };

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Find station name by ID
  const getStationName = (stationId: string): string => {
    // Use strict string comparison for finding the station
    const station = stations.find(s => String(s.id) === String(stationId));
    return station ? station.name : 'Unknown Station';
  };

  // Render message item
  const renderMessage = (message: ChatMessage) => {
    const isSent = message.sender_station_id === selectedStationId;
    const isBroadcast = message.recipient_station_id === null;
    const isDeleted = 'deleted' in message && message.deleted === true;
    
    let messageClass = styles.messageItem;
    if (isBroadcast) {
      messageClass += ' ' + styles.broadcastMessage;
    } else if (isSent) {
      messageClass += ' ' + styles.sentMessage;
    } else {
      messageClass += ' ' + styles.receivedMessage;
    }
    
    return (
      <div key={message.id} className={messageClass}>
        <div className={styles.messageHeader}>
          <span>
            {!isSent && !isBroadcast && getStationName(message.sender_station_id)}
            {isSent && message.recipient_station_id && `To: ${getStationName(message.recipient_station_id)}`}
            {isBroadcast && 'Broadcast'}
            {!message.read && !isSent && <span className={styles.unreadIndicator} />}
          </span>
          <span className={styles.timestamp}>
            {formatTimestamp(message.timestamp)}
            {isSent && (
              <span 
                className={styles.deleteButton} 
                onClick={() => handleDeleteMessage(message.id)}
                title="Delete message"
              >
                <Delete24Regular fontSize={16} />
              </span>
            )}
          </span>
        </div>
        <div className={isDeleted ? styles.deletedMessage : styles.messageContent}>
          {message.message}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Text as="h2" block>Chat</Text>
      
      <Card className={styles.controlsCard}>
        <CardHeader 
          header={<Text weight="semibold">Message Controls</Text>}
        />
        
        <div className={styles.stationSelector}>
          <Text weight="semibold" id="sender-label" className={styles.labelText}>
            You are sending as:
          </Text>
          <Dropdown 
            aria-labelledby="sender-label"
            placeholder="Select your station"
            value={selectedStationId ? getStationName(selectedStationId) : undefined}
            onOptionSelect={handleStationChange}
          >
            {availableStations.map(station => {
              const stationStringId = String(station.id);
              return (
                <Option 
                  key={`station-${stationStringId}`} 
                  value={stationStringId}
                  text={station.name}
                >
                  {station.name}
                  {station.unread_messages && station.unread_messages > 0 && (
                    <Badge 
                      appearance="filled" 
                      color="danger" 
                      className={styles.badge}
                      size="small"
                    >
                      {station.unread_messages}
                    </Badge>
                  )}
                </Option>
              );
            })}
          </Dropdown>
        </div>
        
        <div className={styles.stationSelector}>
          <Text weight="semibold" id="recipient-label" className={styles.labelText}>
            Send to:
          </Text>
          <Dropdown 
            aria-labelledby="recipient-label"
            placeholder="Select recipient or broadcast"
            value={recipientStationId ? getStationName(recipientStationId) : "Broadcast to All"}
            onOptionSelect={handleRecipientChange}
            disabled={!selectedStationId}
          >
            <Option key="broadcast" value="broadcast" text="Broadcast to All">
              Broadcast to All
            </Option>
            {availableStations
              .filter(station => station.id !== selectedStationId)
              .map(station => {
                const stationStringId = String(station.id);
                return (
                  <Option 
                    key={`recipient-${stationStringId}`} 
                    value={stationStringId} 
                    text={station.name}
                  >
                    {station.name}
                  </Option>
                );
              })}
          </Dropdown>
        </div>
      </Card>
      
      <div className={styles.chatContainer}>
        <div className={styles.messagesList}>
          {displayedMessages.length > 0 ? (
            displayedMessages.map(message => renderMessage(message))
          ) : (
            <div className={styles.noMessages}>
              <Text size={400}>No messages yet. Start a conversation!</Text>
            </div>
          )}
        </div>
        
        <div className={styles.inputContainer}>
          <Input
            className={styles.messageInput}
            placeholder={selectedStationId ? "Type your message here..." : "Select a station to start chatting"}
            value={messageText}
            onChange={(e, data) => setMessageText(data.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={!selectedStationId}
          />
          <Button 
            appearance="primary" 
            icon={<Send24Regular />}
            onClick={handleSendMessage}
            disabled={!selectedStationId || !messageText.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}; 
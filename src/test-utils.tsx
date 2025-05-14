import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

// A simple render function with act() wrapper to prevent warnings
function render(ui: ReactElement, options?: RenderOptions) {
  let result: any;
  act(() => {
    result = rtlRender(ui, options);
  });
  return result;
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render }; 
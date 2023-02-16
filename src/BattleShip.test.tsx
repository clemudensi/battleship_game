import React from 'react';
import { render, fireEvent, Matcher, MatcherOptions, waitFor } from '@testing-library/react';
import Board from './BattleShip';

let getByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement,
  queryAllByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement[],
  container: HTMLElement;

describe('<Board />', () => {
  beforeEach(() => {
    const component = render(<Board />);
    getByTestId = component.getByTestId;
    queryAllByTestId = component.queryAllByTestId;
    container = component.container;
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should render the game board', () => {
    const squares = queryAllByTestId('square');
    expect(squares).toHaveLength(100);
  });

  it('should handle player shots correctly', () => {
    const square = container.querySelector('[style="background-color: white; border: 1px solid black; width: 40px; height: 40px;"]');
    square && fireEvent.click(square);
    expect(square).toHaveStyle('background-color: rgb(255, 56, 11)');
  });

  it('should end the game when all ships are sunk', async () => {
    const battleShip = container.querySelectorAll('[style="background-color: gray; border: 1px solid black; width: 40px; height: 40px;"]');
    const destroyer = container.querySelectorAll('[style="background-color: rgb(43, 133, 226); border: 1px solid black; width: 40px; height: 40px;"]');

    [...battleShip, ...destroyer].forEach(square => {
      fireEvent.click(square);
      expect(square).toHaveStyle('background-color: rgb(255, 56, 11)');
    });

    const missedShot = container.querySelector('[style="background-color: white; border: 1px solid black; width: 40px; height: 40px;"]');
    missedShot && fireEvent.click(missedShot);

    await waitFor(() => {
      expect(missedShot).toHaveStyle('background-color: white');
      const message = getByTestId('message')
      expect(message).toHaveTextContent(/game over/i);
    }, { timeout: 1600})
  });
});

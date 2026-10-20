export interface JoystickState {
  x: number;
  y: number;
}

export const joystick: JoystickState = {
  x: 0,
  y: 0,
};

export function resetJoystick() {
  joystick.x = 0;
  joystick.y = 0;
}

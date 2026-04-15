import { describe, it, expect, beforeEach, vi } from 'vitest';

const sentryMocks = vi.hoisted(() => ({
  setUser: vi.fn(),
  setTag: vi.fn(),
  setContext: vi.fn(),
  startSpan: vi.fn(async (_options, callback) => {
    const span = { setAttribute: vi.fn() };
    return callback(span);
  }),
}));

const posthogMocks = vi.hoisted(() => ({
  client: {
    capture: vi.fn(),
    identify: vi.fn(),
    onFeatureFlags: vi.fn(),
    isFeatureEnabled: vi.fn(() => false),
  },
}));

vi.mock('@sentry/browser', () => sentryMocks);
vi.mock('../../js/posthog.js', () => posthogMocks);

import { updateColor, init } from '../../js/script.js';

function createElement(initial = {}) {
  return {
    style: {},
    textContent: '',
    value: '',
    listeners: {},
    addEventListener(event, handler) {
      this.listeners[event] = handler;
    },
    click() {
      this.listeners.click?.();
    },
    ...initial,
  };
}

describe('Critical path: successful color mix', () => {
  let colorBox, hexOutput;

  beforeEach(() => {
    colorBox = { style: { backgroundColor: '' } };
    hexOutput = { textContent: '' };
  });

  it('updates UI correctly after user input', () => {
    updateColor(255, 0, 0, colorBox, hexOutput);
    expect(colorBox.style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(hexOutput.textContent).toBe('#FF0000');
  });
});

describe('login telemetry context', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const elements = {
      red: createElement({ value: '0' }),
      green: createElement({ value: '0' }),
      blue: createElement({ value: '0' }),
      colorBox: createElement({ style: { backgroundColor: '' } }),
      hexColor: createElement({ textContent: '' }),
      applyColor: createElement(),
      resetColor: createElement(),
      sensorBox: createElement({ style: { backgroundColor: '' } }),
      sensorHex: createElement({ textContent: '' }),
      'break-btn': createElement(),
      'urgent-btn': createElement({ style: { display: 'none' } }),
      'login-id': createElement({ value: '12345' }),
      'login-email': createElement({ value: 'student@example.com' }),
      'login-segment': createElement({ value: 'premium_user' }),
      'login-btn': createElement(),
      'logout-btn': createElement(),
      'login-form': createElement({ style: { display: 'block' } }),
      'user-info': createElement({ style: { display: 'none' } }),
      'user-label': createElement({ textContent: '' }),
      'app-status': createElement({ textContent: '' }),
    };

    globalThis.document = {
      getElementById: (id) => elements[id] ?? null,
    };

    globalThis.__testElements = elements;
  });

  it('adds email to Sentry context immediately from the form', () => {
    init();

    expect(posthogMocks.client.identify).toHaveBeenCalledWith(
      '12345',
      expect.objectContaining({
        email: 'student@example.com',
        segment: 'premium_user',
      }),
    );
    expect(sentryMocks.setUser).toHaveBeenCalledWith({
      id: '12345',
      email: 'student@example.com',
    });
  });

  it('keeps showing email after login click', () => {
    init();

    globalThis.__testElements['login-btn'].click();

    expect(globalThis.__testElements['user-label'].textContent).toContain('student@example.com');
  });
});

export interface EventsOptions {
 capture?: boolean;
 once?: boolean;
 passive?: boolean;
}

let hasPassiveEventOption = false;

const noop = () => undefined;

try {
  const options = {
    get passive() {
      hasPassiveEventOption = true;
      return false;
    },
  };
  window.addEventListener('test', noop, options);
  window.removeEventListener('test', noop);
}
catch (err) {
  hasPassiveEventOption = false;
}

export function eventsOptions(
  params: undefined | Partial<EventsOptions>,
): undefined | boolean | EventsOptions {
  if (hasPassiveEventOption) {
    return params;
  }
  return params ? params.capture : undefined;
}

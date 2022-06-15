import { notify } from "../../botPage/view/logger";
import { isProduction, isMobile } from "../utils/tools";
import { TrackJS } from 'trackjs';

export const default_errors_to_ignore = [
    'CallError',
    'WrongResponse',
    'GetProposalFailure',
    'RateLimit',
    'DisconnectError',
    'MarketIsClosed'
  ];

export const trackJSTrack = (error) => {
  if (!error) {
    return;
  }
    let message, code;
   if (typeof error === "string") {
      code = "Unknown";
      message = error;
    } else if (error?.error && typeof error.error === 'object') {
      if (error?.error?.error && typeof error.error.error === 'object') {
        ({ message } = error.error.error);
        ({ code } = error.error.error);
      } else {
        ({ message } = error.error);
        ({ code } = error.error);
      }
    } else {
      ({ message } = error);
      ({ code } = error);
    }
      // Exceptions:
  if (message === undefined || message === "Cannot read property 'open_time' of undefined") {
    // SmartCharts error workaround, don't log nor show.
    return;
  }

  notify({ className: "error", message, position: isMobile() ? 'left' : 'right' });

    if (isProduction()) {
      if(!default_errors_to_ignore.includes(code)){
        TrackJS.track(code);
      }
    }
}
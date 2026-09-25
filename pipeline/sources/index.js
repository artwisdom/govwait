import * as ircc from './ircc.js';
import * as irccFlpt from './ircc-flpt.js';
import * as irccNonCountry from './ircc-noncountry.js';
import * as irccPassport from './ircc-passport.js';
import * as govuk from './govuk.js';
import * as govukInUk from './govuk-inuk.js';
import * as govukPassport from './govuk-passport.js';
import * as inz from './inz.js';

// Only sources that are currently safe and permitted to collect belong here.
// A source that closes access is removed from this list; its prior observations
// remain append-only and are governed by an explicit retained-source policy.
export const ACTIVE_SOURCES = Object.freeze([
  ircc,
  irccFlpt,
  irccNonCountry,
  irccPassport,
  govuk,
  govukInUk,
  govukPassport,
  inz,
]);

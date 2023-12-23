import { Config, Context } from "@netlify/functions";
import {
  names,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";
// const example = {
//   [Symbol(realm)]: {
//     settingsObject: { baseUrl: undefined, origin: [Getter], policyContainer: [Object] }
//   },
//   [Symbol(state)]: {
//     method: 'POST',
//     localURLsOnly: false,
//     unsafeRequest: false,
//     body: {
//       stream: undefined,
//       source: '{"type": "UPDATE", "table": "users", "record": {"id": "44704940-7699-4f71-b2fd-c7ea6ac47a93", "aud": "authenticated", "role": "authenticated", "email": "nspann77@gmail.com", "phone": null, "created_at": "2023-12-13T05:03:26.790788+00:00", "deleted_at": null, "invited_at": null, "updated_at": "2023-12-21T06:05:47.989354+00:00", "instance_id": "00000000-0000-0000-0000-000000000000", "is_sso_user": false, "banned_until": null, "confirmed_at": "2023-12-13T05:04:34.471313+00:00", "email_change": "", "phone_change": "", "is_super_admin": null, "recovery_token": "", "last_sign_in_at": "2023-12-21T06:05:47.983312+00:00", "recovery_sent_at": "2023-12-21T06:05:11.569783+00:00", "raw_app_meta_data": {"provider": "email", "providers": ["email"]}, "confirmation_token": "", "email_confirmed_at": "2023-12-13T05:04:34.471313+00:00", "encrypted_password": "$2a$10$xkAnAcPXSrOqnLdEuqJE5.MCCt7P/VU/LImltRKSjOYueRZxDvc7i", "phone_change_token": "", "phone_confirmed_at": null, "raw_user_meta_data": {}, "confirmation_sent_at": "2023-12-13T05:03:26.794234+00:00", "email_change_sent_at": null, "phone_change_sent_at": null, "email_change_token_new": "", "reauthentication_token": "", "reauthentication_sent_at": null, "email_change_token_current": "", "email_change_confirm_status": 0}, "schema": "auth", "old_record": {"id": "44704940-7699-4f71-b2fd-c7ea6ac47a93", "aud": "authenticated", "role": "authenticated", "email": "nspann77@gmail.com", "phone": null, "created_at": "2023-12-13T05:03:26.790788+00:00", "deleted_at": null, "invited_at": null, "updated_at": "2023-12-21T06:05:47.98175+00:00", "instance_id": "00000000-0000-0000-0000-000000000000", "is_sso_user": false, "banned_until": null, "confirmed_at": "2023-12-13T05:04:34.471313+00:00", "email_change": "", "phone_change": "", "is_super_admin": null, "recovery_token": "", "last_sign_in_at": "2023-12-21T06:03:33.559152+00:00", "recovery_sent_at": "2023-12-21T06:05:11.569783+00:00", "raw_app_meta_data": {"provider": "email", "providers": ["email"]}, "confirmation_token": "", "email_confirmed_at": "2023-12-13T05:04:34.471313+00:00", "encrypted_password": "$2a$10$xkAnAcPXSrOqnLdEuqJE5.MCCt7P/VU/LImltRKSjOYueRZxDvc7i", "phone_change_token": "", "phone_confirmed_at": null, "raw_user_meta_data": {}, "confirmation_sent_at": "2023-12-13T05:03:26.794234+00:00", "email_change_sent_at": null, "phone_change_sent_at": null, "email_change_token_new": "", "reauthentication_token": "", "reauthentication_sent_at": null, "email_change_token_current": "", "email_change_confirm_status": 0}}',
//       length: 2539
//     },
//     reservedClient: null,
//     replacesClientId: '',
//     window: 'client',
//     keepalive: false,
//     serviceWorkers: 'all',
//     initiator: '',
//     destination: '',
//     priority: null,
//     origin: 'client',
//     policyContainer: 'client',
//     referrer: 'client',
//     referrerPolicy: '',
//     mode: 'cors',
//     useCORSPreflightFlag: false,
//     credentials: 'same-origin',
//     useCredentials: false,
//     cache: 'default',
//     redirect: 'follow',
//     integrity: '',
//     cryptoGraphicsNonceMetadata: '',
//     parserMetadata: '',
//     reloadNavigation: false,
//     historyNavigation: false,
//     userActivation: false,
//     taintedOrigin: false,
//     redirectCount: 0,
//     responseTainting: 'basic',
//     preventNoCacheCacheControlHeaderModification: false,
//     done: false,
//     timingAllowFailed: false,
//     url: {
//       href: 'https://starlit-dragon-4c6a5c.netlify.app/add-user',
//       origin: 'https://starlit-dragon-4c6a5c.netlify.app',
//       protocol: 'https:',
//       username: '',
//       password: '',
//       host: 'starlit-dragon-4c6a5c.netlify.app',
//       hostname: 'starlit-dragon-4c6a5c.netlify.app',
//       port: '',
//       pathname: '/add-user',
//       search: '',
//       searchParams: {},
//       hash: ''
//     }
//   },
// }

// const reqBody = {
//   type: 'UPDATE',
//   table: 'users',
//   record: {
//     id: '44704940-7699-4f71-b2fd-c7ea6ac47a93',
//     aud: 'authenticated',
//     role: 'authenticated',
//     email: 'nspann77@gmail.com',
//     phone: null,
//     created_at: '2023-12-13T05:03:26.790788+00:00',
//     deleted_at: null,
//     invited_at: null,
//     updated_at: '2023-12-21T06:42:16.798355+00:00',
//     instance_id: '00000000-0000-0000-0000-000000000000',
//     is_sso_user: false,
//     banned_until: null,
//     confirmed_at: '2023-12-13T05:04:34.471313+00:00',
//     email_change: '',
//     phone_change: '',
//     is_super_admin: null,
//     recovery_token: '',
//     last_sign_in_at: '2023-12-21T06:16:12.392813+00:00',
//     recovery_sent_at: '2023-12-21T06:41:53.948521+00:00',
//     raw_app_meta_data: { provider: 'email', providers: [Array] },
//     confirmation_token: '',
//     email_confirmed_at: '2023-12-13T05:04:34.471313+00:00',
//     encrypted_password: '$2a$10$xkAnAcPXSrOqnLdEuqJE5.MCCt7P/VU/LImltRKSjOYueRZxDvc7i',
//     phone_change_token: '',
//     phone_confirmed_at: null,
//     raw_user_meta_data: {},
//     confirmation_sent_at: '2023-12-13T05:03:26.794234+00:00',
//     email_change_sent_at: null,
//     phone_change_sent_at: null,
//     email_change_token_new: '',
//     reauthentication_token: '',
//     reauthentication_sent_at: null,
//     email_change_token_current: '',
//     email_change_confirm_status: 0
//   },
//   schema: 'auth',
//   old_record: {
//     id: '44704940-7699-4f71-b2fd-c7ea6ac47a93',
//     aud: 'authenticated',
//     role: 'authenticated',
//     email: 'nspann77@gmail.com',
//     phone: null,
//     created_at: '2023-12-13T05:03:26.790788+00:00',
//     deleted_at: null,
//     invited_at: null,
//     updated_at: '2023-12-21T06:41:54.306059+00:00',
//     instance_id: '00000000-0000-0000-0000-000000000000',
//     is_sso_user: false,
//     banned_until: null,
//     confirmed_at: '2023-12-13T05:04:34.471313+00:00',
//     email_change: '',
//     phone_change: '',
//     is_super_admin: null,
//     recovery_token: '16858dfb53e265d8037618d256e85e3bf32583ac2612d28b8f8d9624',
//     last_sign_in_at: '2023-12-21T06:16:12.392813+00:00',
//     recovery_sent_at: '2023-12-21T06:41:53.948521+00:00',
//     raw_app_meta_data: { provider: 'email', providers: [Array] },
//     confirmation_token: '',
//     email_confirmed_at: '2023-12-13T05:04:34.471313+00:00',
//     encrypted_password: '$2a$10$xkAnAcPXSrOqnLdEuqJE5.MCCt7P/VU/LImltRKSjOYueRZxDvc7i',
//     phone_change_token: '',
//     phone_confirmed_at: null,
//     raw_user_meta_data: {},
//     confirmation_sent_at: '2023-12-13T05:03:26.794234+00:00',
//     email_change_sent_at: null,
//     phone_change_sent_at: null,
//     email_change_token_new: '',
//     reauthentication_token: '',
//     reauthentication_sent_at: null,
//     email_change_token_current: '',
//     email_change_confirm_status: 0
//   }
// }

interface NetlifyRequest extends Request {
  [key: symbol]: {
    [headersMap: symbol]: {
      [headersList: symbol]: Map<"authorization", {
          value: string
        }>
    },
    body: {
      source: string;
    }
  },
}

interface ErrorObj extends Error {
  code?: number;
}

export default async (req: NetlifyRequest, context: Context) => {
  console.log("You have reached here!!", req);
  // console.log("Get body", req.body);
  const headersSymbol: symbol = Object.getOwnPropertySymbols(req).find(
    (s) => s.description === "headers"
  )!;

  const headersListSymbol = req[headersSymbol]
    ? Object.getOwnPropertySymbols(req[headersSymbol]).find(
        (s) => s.description === "headers list"
      )
    : null;

  const headersMapSymbol =
    req[headersSymbol] && headersListSymbol && req[headersSymbol][headersListSymbol]
      ? Object.getOwnPropertySymbols(
          req[headersSymbol][headersListSymbol]
        ).find((s) => s.description === "headers map")
      : null;

  const headers = req[headersSymbol];
  const headersList = headersListSymbol && headers[headersListSymbol];
  const headersMap = headersListSymbol && headersMapSymbol && headersList?.[headersMapSymbol];
  const authObj = headersMap?.get("authorization");
  const authorizationKey = authObj && authObj.value;

  if (
    !(process.env.AUTHORIZATION_KEY === authorizationKey)
  ) {
    const authorizationError: ErrorObj = new Error("NOT AUTHORIZED");
    authorizationError.code = 401;
    throw authorizationError;
  }

  const stateSymbol = Object.getOwnPropertySymbols(req).find(
    (s) => s.description === "state"
  );

  if (stateSymbol) {
    const reqBody = req[stateSymbol].body;
    if (reqBody && reqBody.source && typeof reqBody.source === "string") {
      const parsedBody = JSON.parse(reqBody.source);
      console.log("reqBody", parsedBody);
      console.log("parsedBody", parsedBody.record.id);

      const numberDictionary = NumberDictionary.generate({
        min: 100,
        max: 999,
      });

      const userName: string = uniqueNamesGenerator({
        dictionaries: [names, numberDictionary]
      });

      console.log("userName", userName);
    }
  }

  return new Response(JSON.stringify({ hello: "world" }));
};

export const config: Config = {
  path: "/add-user",
};

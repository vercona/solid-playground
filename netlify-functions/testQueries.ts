const fetchQueries = async () => {
    const response = await fetch("http://localhost:8888/add-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization:
          "Prn@b^8y2DZk3xXt<B6haqBSgPy&F2LJWtY-D+7EMZvjTCY=Ng$9E>?xWq+bGy*5kg+!t<3Ldj@fTPW#DrV4>z7eNVKcH-85hT4A>=$yqGsnk",
      },
      body: '{"type": "UPDATE", "table": "users", "record": {"id": "44704940-7699-4f71-b2fd-c7ea6ac47a93", "aud": "authenticated", "role": "authenticated", "email": "nspann77@gmail.com", "phone": null, "created_at": "2023-12-13T05:03:26.790788+00:00", "deleted_at": null, "invited_at": null, "updated_at": "2023-12-23T01:38:45.553143+00:00", "instance_id": "00000000-0000-0000-0000-000000000000", "is_sso_user": false, "banned_until": null, "confirmed_at": "2023-12-13T05:04:34.471313+00:00", "email_change": "", "phone_change": "", "is_super_admin": null, "recovery_token": "4e5226da51c51ee90804e5538dda4cfcc865bba157030eefb51a1307", "last_sign_in_at": "2023-12-22T02:00:51.866248+00:00", "recovery_sent_at": "2023-12-23T01:38:45.179726+00:00", "raw_app_meta_data": {"provider": "email", "providers": ["email"]}, "confirmation_token": "", "email_confirmed_at": "2023-12-13T05:04:34.471313+00:00", "encrypted_password": "$2a$10$xkAnAcPXSrOqnLdEuqJE5.MCCt7P/VU/LImltRKSjOYueRZxDvc7i", "phone_change_token": "", "phone_confirmed_at": null, "raw_user_meta_data": {}, "confirmation_sent_at": "2023-12-13T05:03:26.794234+00:00", "email_change_sent_at": null, "phone_change_sent_at": null, "email_change_token_new": "", "reauthentication_token": "", "reauthentication_sent_at": null, "email_change_token_current": "", "email_change_confirm_status": 0}, "schema": "auth", "old_record": {"id": "44704940-7699-4f71-b2fd-c7ea6ac47a93", "aud": "authenticated", "role": "authenticated", "email": "nspann77@gmail.com", "phone": null, "created_at": "2023-12-13T05:03:26.790788+00:00", "deleted_at": null, "invited_at": null, "updated_at": "2023-12-22T02:00:51.872554+00:00", "instance_id": "00000000-0000-0000-0000-000000000000", "is_sso_user": false, "banned_until": null, "confirmed_at": "2023-12-13T05:04:34.471313+00:00", "email_change": "", "phone_change": "", "is_super_admin": null, "recovery_token": "", "last_sign_in_at": "2023-12-22T02:00:51.866248+00:00", "recovery_sent_at": "2023-12-22T01:59:44.26614+00:00", "raw_app_meta_data": {"provider": "email", "providers": ["email"]}, "confirmation_token": "", "email_confirmed_at": "2023-12-13T05:04:34.471313+00:00", "encrypted_password": "$2a$10$xkAnAcPXSrOqnLdEuqJE5.MCCt7P/VU/LImltRKSjOYueRZxDvc7i", "phone_change_token": "", "phone_confirmed_at": null, "raw_user_meta_data": {}, "confirmation_sent_at": "2023-12-13T05:03:26.794234+00:00", "email_change_sent_at": null, "phone_change_sent_at": null, "email_change_token_new": "", "reauthentication_token": "", "reauthentication_sent_at": null, "email_change_token_current": "", "email_change_confirm_status": 0}}',
    });
    const formattedRes = await response.json();
    console.log("formattedRes", formattedRes)
};

fetchQueries();

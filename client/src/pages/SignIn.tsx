import { Component, Show, createSignal } from "solid-js";
import { magicEmailLinkLogin } from "../apiCalls/AuthCalls";
import { formatErrorUrl } from "../utils/utilFunctions";
import type { ErrorType } from "../utils/interfaces";
import CurrentlySending from "../components/CurrentlySending";

const currentlySending = () => {
  return(
    <div>Sending...</div>
  )
};

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const SignIn = () => {
  const [emailInput, setEmailInput] = createSignal("");
  const [settings, setSettings] = createSignal({
    emailLinkSignIn: {
      errorMessage: "",
      successMessage: "",
      isSending: false,
    }
  })

  const submit = async (e: Event) => {
    e.preventDefault();
    const isEmailValid = emailInput().toLocaleLowerCase().match(emailRegex);

    setSettings((currentSettings) => ({
      ...currentSettings,
      emailLinkSignIn: {
        ...currentSettings.emailLinkSignIn,
        isSending: true,
      },
    }));
    if(isEmailValid){
      try{
        await magicEmailLinkLogin(emailInput());
        setSettings((currentSettings) => ({
          ...currentSettings,
          emailLinkSignIn: {
            isSending: false,
            errorMessage: "",
            successMessage: "Email sent. Please check your inbox!",
          },
        }));
      }catch(err){
        const formattedError = formatErrorUrl(err as ErrorType);
        setSettings((currentSettings) => ({
          ...currentSettings,
          emailLinkSignIn: {
            isSending: false,
            errorMessage: formattedError.errorMessage,
            successMessage: "",
          },
        }));
      }
    }else{
      setSettings((currentSettings) => ({
        ...currentSettings,
        emailLinkSignIn: {
          isSending: false,
          errorMessage: "Invalid Email",
          successMessage: "",
        },
      }));
    }
  };

  return (
    <div class="flex justify-center items-center overflow-hidden h-fullScreen">
      <form onSubmit={submit} class="flex flex-col items-center">
        <label>
          Enter your email here and we will send a link to login/signup
        </label>
        <input
          class="text-black w-44"
          type="text"
          value={emailInput()}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <Show
          when={!settings().emailLinkSignIn.isSending}
          fallback={CurrentlySending()}
        >
          <input
            type="submit"
            class="btn btn-primary me-2 mt-2"
            value="Submit"
          />
        </Show>
        <Show when={settings().emailLinkSignIn.errorMessage}>
          <div class="text-red-600">
            {settings().emailLinkSignIn.errorMessage}
          </div>
        </Show>
        <Show when={settings().emailLinkSignIn.successMessage}>
          <div class="text-emerald-400">
            {settings().emailLinkSignIn.successMessage}
          </div>
        </Show>
      </form>
    </div>
  );
};

export default SignIn;

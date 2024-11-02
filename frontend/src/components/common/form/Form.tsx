import "./Form.scss";
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import i18n from "i18n";
import {
  FormEvent,
  useCallback,
  PropsWithChildren,
  ReactElement,
  useRef,
  FC,
  useEffect,
  useState,
} from "react";
import { getNoop } from "services/api";

interface Props {
  className?: string;
  getData?(): Promise<unknown>;
  getDataName?: string;
  getDataCallback?(data: unknown): void;
  onSubmit: () => Promise<void | AxiosResponse>;
  showError?: boolean;
  success?: ReactElement;
  submitOnBlur?: boolean;
}

type FormState = "submitting" | "success" | "error" | "loading" | "ready";
type FormExtra = { touched: boolean };

function formClasses(
  baseClassName: string,
  state: FormState,
  extra: FormExtra
) {
  let classes = "form__validated";
  classes += baseClassName ? ` ${baseClassName}` : "";

  if (extra.touched) {
    classes += " form--touched";
  }

  switch (state) {
    case "loading":
      classes += " form--loading";
      break;
    case "submitting":
      classes += " form--submitting";
      break;
    case "error":
      classes += " form--error";
      break;
    default:
  }

  return classes;
}

function messagesFromError(error: unknown): string[] {
  if (error instanceof AxiosError && error.response?.data?.errors) {
    const errors = error.response?.data?.errors;
    if (Array.isArray(errors)) {
      return errors.map((error) => i18n.t(error));
    }
    const messages = [];
    for (const key in errors) {
      messages.push(i18n.t(errors[key]));
    }
    return messages;
  }
  if (error instanceof AxiosError && error.response?.data?.message) {
    return [i18n.t(error.response?.data?.message)];
  }
  if (error instanceof Error && error.message) {
    return [i18n.t(error.message)];
  }

  return [i18n.t("Unexpected error. Please try again later.")];
}

function getFormState(
  query: UseQueryResult<unknown, unknown>,
  mutation: UseMutationResult<void | AxiosResponse, unknown, void, unknown>
): FormState {
  if (query.isPending) {
    return "loading";
  }
  if (query.error) {
    return "error";
  }
  if (mutation.isPending) {
    return "submitting";
  }
  if (mutation.error || mutation.data instanceof AxiosError) {
    return "error";
  }
  if (mutation.isSuccess) {
    return "success";
  }
  return "ready";
}

function getErrorMessages(
  query: UseQueryResult<unknown, unknown>,
  mutation: UseMutationResult<void | AxiosResponse, unknown, void, unknown>
): string[] | null {
  if (query.error) {
    return messagesFromError(query.error);
  }
  if (mutation.error) {
    return messagesFromError(mutation.error);
  }
  if (mutation.data instanceof AxiosError) {
    return messagesFromError(mutation.data);
  }
  return null;
}

const Form: FC<PropsWithChildren<Props>> = ({
  children,
  className = "Form",
  getData = getNoop,
  getDataName = "",
  getDataCallback,
  onSubmit,
  showError = true,
  success = undefined,
  submitOnBlur = false,
}) => {
  if (getData !== getNoop && !getDataName) {
    console.error("getDataName is required when getData is provided");
  }
  const query = useQuery({
    queryKey: [getDataName],
    queryFn: getData,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: onSubmit,
    onSuccess: (response: void | AxiosResponse) => {
      // Invalidate and refetch
      setTouched(false);
      if (response?.status !== 204) {
        queryClient.invalidateQueries({ queryKey: [getDataName] });
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const [touched, setTouched] = useState(false);
  const mutationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (query.isRefetching) {
      return;
    }
    if (query.isSuccess && getDataCallback) {
      getDataCallback(query.data);
    }
  }, [getDataCallback, query.data, query.isRefetching, query.isSuccess]);

  useEffect(() => {
    if (!formRef.current) {
      return;
    }
    const form = formRef.current;
    const handler = () => {
      setTouched(true);
    };
    form.addEventListener("change", handler);
    form.addEventListener("keyup", handler);
    return () => {
      form.removeEventListener("change", handler);
      form.removeEventListener("keyup", handler);
    };
  }, []);

  useEffect(() => {
    if (!formRef.current) {
      return;
    }
    const form = formRef.current;
    const handler = () => {
      setTouched(false);
      queryClient.invalidateQueries({
        queryKey: [getDataName],
        refetchType: "all",
      });
    };
    form.addEventListener("reset", handler);
    return () => {
      form.removeEventListener("reset", handler);
    };
  }, [getDataName, queryClient]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      mutation.mutate();
    },
    [mutation]
  );

  const handleBlur = useCallback(async () => {
    if (mutationRef.current) {
      clearTimeout(mutationRef.current);
    }
    mutationRef.current = setTimeout(() => {
      mutation.mutate();
    }, 500);
  }, [mutation]);

  const handleFocus = useCallback(async () => {
    if (mutationRef.current) {
      clearTimeout(mutationRef.current);
      mutationRef.current = null;
    }
  }, []);

  const formState = getFormState(query, mutation);
  const errorMessages = getErrorMessages(query, mutation);

  if (formState === "success" && success) {
    return success;
  }

  return (
    <div className="FormContainer">
      <form
        onSubmit={handleSubmit}
        className={formClasses(className, formState, { touched })}
        onBlur={submitOnBlur ? handleBlur : undefined}
        onFocus={submitOnBlur ? handleFocus : undefined}
        ref={formRef}
      >
        {children}
        {showError &&
          errorMessages &&
          errorMessages.map((errorMessage) => (
            <p className="Form__ErrorMessage" key={errorMessage}>
              {errorMessage}
            </p>
          ))}
      </form>
    </div>
  );
};

export default Form;

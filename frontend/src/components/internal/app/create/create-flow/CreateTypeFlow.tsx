import "./CreateFlow.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Navigate,
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { createType, getType, saveType } from "services/font";

const CreateTypeFlow = () => {
  const [mainFamily, setMainFamily] = useState<string | undefined>(undefined);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [ratio, setRatio] = useState<number | undefined>(undefined);
  const [family, setFamily] = useState<string | undefined>(undefined);
  const [typeCoordinates, setTypeCoordinates] = useState({
    top: 0,
    left: 0,
  });
  const { id: idParam } = useParams<{ id: string | undefined }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const id = useRef(idParam ? parseInt(idParam) : undefined);

  const { isLoading, isSuccess } = useQuery({
    queryKey: [`getType_${id.current}`],
    queryFn: () => {
      if (!idParam) {
        return;
      }
      const promise = getType(parseInt(idParam));
      promise
        .then((type) => {
          if (!type) {
            return;
          }
          setMainFamily(type.main_family);
          setWeight(type.weight);
          setRatio(type.ratio);
          setFamily(type.family);
        })
        .catch((e) => {
          console.error(e);
          return navigate("/app/visuals/type");
        });
      return promise;
    },
    enabled: Boolean(idParam),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const createMutation = useMutation({
    mutationFn: id.current ? saveType : createType,
  });

  const create = useCallback(() => {
    if (!mainFamily || weight === undefined || ratio === undefined || !family) {
      return;
    }

    createMutation.mutate(
      {
        id: id.current,
        main_family: mainFamily,
        weight,
        ratio,
        family,
      },
      {
        onSuccess(data) {
          if (data?.id) {
            sessionStorage.setItem("font_id", data?.id.toString());
          }
        },
      }
    );
  }, [createMutation, family, id, mainFamily, ratio, weight]);

  const ready = !idParam || (!isLoading && isSuccess);

  if (createMutation.isSuccess) {
    return <Navigate to="/app/visuals/font" replace={true} />;
  }

  return (
    <div className="CreateFlow Layout --SideColumn">
      {ready ? (
        <Outlet
          context={{
            id: id.current,
            mainFamily,
            setMainFamily,
            weight,
            setWeight,
            ratio,
            setRatio,
            family,
            setFamily,
            typeCoordinates,
            setTypeCoordinates,
            create,
          }}
        />
      ) : (
        <>{t("Getting your palette details...")}</>
      )}
      {createMutation.isError && (
        <div>
          <p className="p --s">
            {t("Something went wrong while creating your type.")}
          </p>
        </div>
      )}
      {createMutation.isPending && <>{t("Creating your palette...")}</>}
    </div>
  );
};

interface TypeFlowContextInterface {
  id: number | undefined;
  mainFamily: string | undefined;
  setMainFamily: (family: string) => void;
  weight: number | undefined;
  setWeight: (weight: number) => void;
  ratio: number | undefined;
  setRatio: (ratio: number) => void;
  family: string | undefined;
  setFamily: (family: string) => void;
  typeCoordinates: {
    top: number;
    left: number;
  };
  setTypeCoordinates: (coordinates: { top: number; left: number }) => void;
  create: () => void;
}

export function useTypeFlowContext() {
  return useOutletContext<TypeFlowContextInterface>();
}

export default CreateTypeFlow;

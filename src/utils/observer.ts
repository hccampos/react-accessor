import { FunctionComponent, useEffect, useRef, useState } from "react";
import { watch } from "@arcgis/core/core/reactiveUtils";
import { useForceUpdate } from "./useForceUpdate";

interface WatchInfo<T> {
  handle: IHandle;
  mounted: boolean;
  changedBeforeMount: boolean;
}

interface RenderResult<T> {
  vdom: T | null;
  exception: unknown | null;
}

export function observer<P extends object, TRef = {}>(baseComponent: FunctionComponent<P>) {
  return (props: P, ref: React.Ref<TRef>) => {
    return useObserver(() => baseComponent(props, ref));
  };
}

export function useObserver<T>(fn: () => T): T {
  const forceUpdate = useForceUpdate();
  const [renderResult, setRenderResult] = useState<RenderResult<T> | null>(null);
  const handleRef = useRef<WatchInfo<T> | null>(null);

  useEffect(() => {
    let watchInfo = handleRef.current;

    if (watchInfo) {
      watchInfo.mounted = true;

      // Got a change before first mount, force an update
      if (watchInfo.changedBeforeMount) {
        watchInfo.changedBeforeMount = false;
        forceUpdate();
      }
    } else {
      watchInfo = handleRef.current = {
        handle: watch(
          (): RenderResult<T> => {
            let vdom: T | null = null;
            let exception: unknown | null = null;

            try {
              vdom = fn();
            } catch (e) {
              exception = e;
            }

            return { vdom, exception };
          },
          (result) => setRenderResult(result ?? null),
          { initial: true }
        ),
        mounted: true,
        changedBeforeMount: false,
      };
    }

    // Stop the watch when the component is unmounted.
    return () => {
      handleRef.current!.handle.remove();
      handleRef.current = null;
    };
  }, []);

  if (renderResult) {
    if (renderResult.exception) {
      throw renderResult.exception;
    }

    if (renderResult.vdom) {
      return renderResult.vdom;
    }
  }

  return fn();
}

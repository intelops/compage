import clsx from "clsx";
import DUMMY_JSON from "@/temp-data.json";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { SquareButton } from "../SquareButton";
import {
  MdCode,
  MdContentCopy,
  MdOutlineChangeCircle,
  MdUpdate,
} from "react-icons/md";

type Props = {
  collapsed: boolean;
  setCollapsed(collapsed: boolean): void;
  shown: boolean;
  position?: "left" | "right";
  width?: number;
};

const Sidebar: React.FC<Props> = ({
  collapsed,
  shown,
  setCollapsed,
  position = "left",
  width = 300,
}) => {
  const IconSymbol = position === "left"
    ? (collapsed ? ">" : "<")
    : (collapsed ? "<" : ">");
  const collapsedWidth = 16;
  return (
    <div
      style={{
        width: collapsed ? `${collapsedWidth}px` : `${width}px`,
      }}
      className={clsx(
        "bg['#F0F6FF'] text-zinc-50 fixed md:static z-20 transition-all duration-300 ease-in-out h-screen",
        {
          "md:translate-x-0": !collapsed,
          "-translate-x-full": !shown && position === "left",
          "translate-x-[-100%+64px]": !shown && position === "right", // subtracting width of the collapsed sidebar
          "left-0": position === "left",
          "right-0": position === "right",
        },
      )}
    >
      <div
        className={clsx(
          "flex flex-col justify-between h-screen md:h-full sticky inset-0",
        )}
      >
        <div
          className={clsx(
            "flex items-center border-b border-b-indigo-800 transition-none",
            {
              "p-4 justify-between": !collapsed,
              "py-4 justify-center": collapsed,
              "flex-row-reverse": position === "right",
            },
          )}
        >
          <button
            className="grid place-content-center hover:bg-indigo-800 w-10 h-10 rounded-full opacity-0 md:opacity-100 text-black transition-all duration-300 ease-in-out"
            onClick={() => setCollapsed(!collapsed)}
          >
            {IconSymbol}
          </button>
        </div>
        {!collapsed &&
          (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                height: "100%",
                width: `${width}px`,
              }}
            >
              <ReactCodeMirror
                value={JSON.stringify(DUMMY_JSON, null, 1)}
                extensions={[json()]}
                theme={dracula}
                height="500px"
              />
              <>
                <h1 className="text-lg font-bold text-left text-indigo-800 mt-2">
                  PROJECT_NAME
                </h1>
              </>
              <div
                style={{
                  height: 180,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <SquareButton
                  iconStyle={{
                    style: {
                      width: 20,
                      height: 20,
                    },
                  }}
                  icon={() => <MdContentCopy />}
                  text="Copy to Clipboard"
                />
                <SquareButton
                  iconStyle={{
                    style: {
                      width: 20,
                      height: 20,
                    },
                  }}
                  icon={() => <MdUpdate />}
                  text="Update Changes"
                />
                <SquareButton
                  iconStyle={{
                    style: {
                      width: 20,
                      height: 20,
                    },
                  }}
                  icon={() => <MdCode />}
                  text="Generate Code"
                />
                <SquareButton
                  iconStyle={{
                    style: {
                      width: 20,
                      height: 20,
                    },
                  }}
                  icon={() => <MdOutlineChangeCircle />}
                  text="Switch Project"
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Sidebar;

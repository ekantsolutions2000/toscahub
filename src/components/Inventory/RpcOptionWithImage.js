import { components } from "react-select";
import Tooltip from "../Tooltip";
import ImageContent from "./ImageContent";

const Option = (props) => {
  const { rawData } = props.data;
  const { isFocused } = props;

  return (
    <Tooltip
      show={isFocused}
      content={
        <div className="tw-w-52 tw-h-52 tw-text-center tw-px-4 tw-py-4">
          <span className="tw-uppercase">
            {rawData.itemBrand} {rawData.itemClassId}
          </span>
          <p className="tw-font-bold">{rawData.modelSize}</p>

          <div className="tw-relative tw-w-full tw-h-32">
            {isFocused && (
              <ImageContent rawData={rawData} mediaUrl={rawData.mediaUrl} />
            )}
          </div>
        </div>
      }
      config={{
        zIndex: "99",
        theme: "light",
        trigger: "manual",
        placement: "right",
      }}
    >
      <div>
        <components.Option {...props} />
      </div>
    </Tooltip>
  );
};

export default Option;

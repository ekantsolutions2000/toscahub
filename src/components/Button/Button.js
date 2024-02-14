import PropTypes from "prop-types";
import { cva } from "class-variance-authority";

const buttonStyle = cva("tw-px-2 md:tw-px-4 tw-rounded tw-font-normal", {
  variants: {
    brand: {
      primary:
        "tw-bg-tosca-orange hover:tw-opacity-90 tw-text-white disabled:tw-opacity-90",
      secondary: "tw-bg-tosca-blue hover:tw-bg-opacity-90 tw-text-dark",
      danger: "tw-bg-red-600 hover:tw-bg-opacity-90 tw-text-white",
    },
    fullwidth: {
      true: "tw-w-full",
    },
    size: {
      md: "tw-h-[32px] md:tw-h-[40px] tw-text-sm md:tw-text-base",
      sm: "tw-h-[32px] tw-text-sm",
      xs: "tw-h-[24px] tw-text-xs",
    },
  },
  defaultVariants: {
    brand: "primary",
    fullwidth: false,
  },
});

function Button(props) {
  const { brand, fullwidth, size } = props;
  return (
    <button
      className={buttonStyle({ brand, fullwidth, size })}
      {...props}
    ></button>
  );
}

Button.defaultProps = {
  size: "md",
};

Button.propTypes = {
  fullwidth: PropTypes.string,
  brand: PropTypes.string,
  size: PropTypes.oneOf(["md", "sm", "xs"]),
};

export default Button;

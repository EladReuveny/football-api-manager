type SliddingDashArrowIconProps = {};

const SliddingDashArrowIcon = ({}: SliddingDashArrowIconProps) => {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 72 72">
      <path
        className="-translate-x-2 group-hover:translate-x-2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40.0001 19.0245C41.0912 17.7776 42.9864 17.6513 44.2334 18.7423L58.9758 33.768C59.6268 34.3377 60.0002 35.1607 60.0002 36.0257C60.0002 36.8908 59.6268 37.7138 58.9758 38.2835L44.2335 53.3078C42.9865 54.3988 41.0913 54.2725 40.0002 53.0256C38.9092 51.7786 39.0355 49.8835 40.2824 48.7924L52.4445 36.0257L40.2823 23.2578C39.0354 22.1667 38.9091 20.2714 40.0001 19.0245Z"
        fill="currentColor"
      />
      <path
        className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
        d="M60 36.0273C60 37.6842 58.6569 39.0273 57 39.0273H18C16.3431 39.0273 15 37.6842 15 36.0273C15 34.3704 16.3431 33.0273 18 33.0273H57C58.6569 33.0273 60 34.3704 60 36.0273Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default SliddingDashArrowIcon;

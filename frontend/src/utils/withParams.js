import { useParams } from "react-router-dom";

// HOC to pass params to a component
export default function withParams(WrappedComponent) {
  return function (props) {
    const params = useParams();
    return <WrappedComponent {...props} {...params} />;
  };
};
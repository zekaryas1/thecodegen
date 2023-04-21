interface ConditionalProps {
  if: any;
  show: JSX.Element;
  else?: JSX.Element;
}

/**
 * Executes a conditional check and returns the appropriate value based on the condition.
 *
 * @param {Object} ConditionalProps - An object that contains the condition, show and elseIf properties.
 * @param {Boolean} ConditionalProps.if - The condition to be checked.
 * @param {*} ConditionalProps.show - The value to be returned if the condition is true.
 * @param {*} ConditionalProps.else - The value to be returned if the condition is false and elseIf is not present.
 * @param {*} ConditionalProps.elseIf - The value to be returned if the condition is false and elseIf is present.
 * @return {*} The value to be returned based on the condition.
 */

function Conditional({ if: condition, show, else: elseIf }: ConditionalProps) {
  if (condition) {
    return show;
  } else if (elseIf) {
    return elseIf;
  } else {
    return <></>;
  }
}

export default Conditional;

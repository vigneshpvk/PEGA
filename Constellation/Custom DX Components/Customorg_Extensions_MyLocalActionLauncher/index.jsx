import PropTypes from 'prop-types';
import { Button } from '@pega/cosmos-react-core';

export function launchLocalAction(getPConnect, assignmentID, action, cb) {
  const actionsAPI = getPConnect().getActionsApi(); // ①
  const openLocalAction = actionsAPI && actionsAPI.openLocalAction.bind(actionsAPI);
  let caseID;
  if (assignmentID.indexOf('!') === -1) {
    caseID = assignmentID;
  } else {
    // "ASSIGN-WORKLIST ON8TTL-C11NGALL-WORK LAT-3!ENTERINFO_FLOW_1" use case
    const [assignKey] = assignmentID.split('!');
    const [, className, workId] = assignKey.split(' ');
    caseID = `${className} ${workId}`;
  }
  openLocalAction(action.ID, {
    // ②
    caseID,
    type: 'express',
    containerName: 'modal',
    name: action.name,
    callbacks: {
      // ③
      submit: response => {
        cb(response);
      },
      cancel: () => {
        cb();
      }
    }
  });
}

const callback = () => {
  // ④
};

const CustomorgExtensionsMyLocalActionLauncher = props => {
  const { getPConnect, buttonText, testId, actionId } = props;

  const availableActions = getPConnect().getValue(PCore.getConstants().CASE_INFO.AVAILABLEACTIONS); // ⑤

  const action = availableActions.filter(act => act.ID === actionId); // ⑥

  const assignmentId = getPConnect().getValue(PCore.getConstants().CASE_INFO.ASSIGNMENT_ID);

  const handleClick = () => {
    launchLocalAction(
      // ⑦
      getPConnect,
      assignmentId,
      action[0],
      callback
    );
  };

  return (
    <>
      {action && assignmentId && (
        <Button variant='simple' onClick={handleClick} data-test-id={testId}>
          {buttonText}
        </Button>
      )}
    </>
  );
};
CustomorgExtensionsMyLocalActionLauncher.propTypes = {
  buttonText: PropTypes.string,
  getPConnect: PropTypes.func,
  testId: PropTypes.string,
  actionId: PropTypes.string
};
export default CustomorgExtensionsMyLocalActionLauncher;

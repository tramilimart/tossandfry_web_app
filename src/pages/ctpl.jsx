import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import AgentContext from '../utils/appContext.jsx';
import CtplForm0 from "../component/ctplForms/ctplForm0.jsx";
import CtplForm1 from "../component/ctplForms/ctplForm1.jsx";
import CtplForm2 from "../component/ctplForms/ctplForm2.jsx";
import CtplForm3 from "../component/ctplForms/ctplForm3.jsx";

const Ctpl = () => {
  const { vehicleType, form, policyId } = useParams();
  const existingPolicyId = policyId ?? '';
  const policyType = `ctpl-${vehicleType}`;

  return (
    <>
      { form == 0 && (
        <CtplForm0 policyType={policyType} existingPolicyId={existingPolicyId}/>
      )}
      { form == 1 && (
        <CtplForm1 policyType={policyType} existingPolicyId={existingPolicyId}/>
      )}
      { form == 2 && (
        <CtplForm2 policyType={policyType} existingPolicyId={existingPolicyId}/>
      )}
      { form == 3 && (
        <CtplForm3 policyType={policyType} existingPolicyId={existingPolicyId}/>
      )}
    </>
  );
};

export default Ctpl;

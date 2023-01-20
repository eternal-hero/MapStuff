import AppButton from "../../global/AppButton";
import { useRouter } from "next/router";
const UpgradePlanModalContent = (props) => {
  const router = useRouter();
  return (
    <div>
      <p>
        You've hit the max number of locations for your plan. Please upgrade to
        add more.
      </p>
      <AppButton
        className="primary"
        label="Upgrade"
        handleClick={() => router.push("/dashboard/plans")}
      />
    </div>
  );
};

export default UpgradePlanModalContent;

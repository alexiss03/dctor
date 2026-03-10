import _OtpInput from "react-otp-input";
import { Input } from "../Input";
import styles from "./style.module.css";

type OtpInputProps = {
  value: string;
  onChange: (newValue: string) => void;
};

export function OtpInput({ value, onChange }: OtpInputProps) {
  return (
    <div className={styles["input-container"]}>
      <_OtpInput
        value={value}
        onChange={onChange}
        numInputs={6}
        renderInput={(props) => (
          <Input {...props} wrapperClassName={styles["otp-input-wrapper"]} />
        )}
        containerStyle={{ justifyContent: "space-between" }}
      />
    </div>
  );
}

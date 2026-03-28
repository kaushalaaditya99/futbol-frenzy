import ThemedText from "../ThemedText";
import Button, { ButtonProps } from "./Button";

interface ButtonHalfWidthProps extends ButtonProps {
    buttonHeight?: number;
}

export default function ButtonHalfWidth(props: ButtonHalfWidthProps) {
    return (
        <Button
            {...props}
            outerStyle={{
                height: 48
            }}
            innerStyle={{
                columnGap: 6,
            }}
            innerMostStyle={{
                // width: "100%"
            }}
        />
    )
}
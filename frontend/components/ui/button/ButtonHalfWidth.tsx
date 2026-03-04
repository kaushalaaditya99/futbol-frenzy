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
                flex: 1,
                alignSelf: undefined,
                height: props.buttonHeight || undefined
            }}
            innerStyle={{
                flex: 1,
                columnGap: 6
            }}
            innerMostStyle={{
                width: "100%"
            }}
        />
    )
}
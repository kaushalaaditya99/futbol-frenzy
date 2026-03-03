import Button, { ButtonProps } from "./Button";

export default function ButtonHalfWidth(props: ButtonProps) {
    return (
        <Button
            {...props}
            outerStyle={{
                flex: 1,
                alignSelf: undefined,
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
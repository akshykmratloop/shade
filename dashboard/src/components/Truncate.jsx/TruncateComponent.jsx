const TruncateComponent = ({string, truncAt,language}) => {

    const isArabic = language === "ar"
    function TruncateText (string, slice) {

        return string.slice(0, slice) + "..."
    }

    const text = TruncateText(string, truncAt ?? 30)

    return (
        <span className="inline-block" dir={isArabic && "rtl"}>
            {text}
        </span>
    )
}

export default TruncateComponent
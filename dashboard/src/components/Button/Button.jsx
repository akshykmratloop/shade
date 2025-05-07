const Button = ({ text, type, classes, functioning, disabled }) => {
    return (
        <button
            onClick={functioning}
            type={type || "button"}
            className={classes}
            disabled={disabled}
        >
            {text}
        </button>

    )
}

export default Button

//"btn mt-2 w-full btn-primary bg-stone-700 hover:bg-stone-700 border-none" + (loading ? " loading" : "")
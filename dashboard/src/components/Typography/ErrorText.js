function ErrorText({styleClass, children, error}){
    if (!error) return null;
    return(
        <p className={`text-center text-error ${styleClass}`}>{children}</p>
    )
}

export default ErrorText
function ErrorText({styleClass, children}){
    return(
        <p className={`text-center text-error text-[8px] flex ${styleClass}`}>{children}</p>
    )
}

export default ErrorText
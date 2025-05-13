type SpinnerSize = "small" | "medium" | "large"

type LoadingSpinnerProps = {
  size?: SpinnerSize
  className?: string
}

const sizeClasses = {
  small: "h-4 w-4 border-2",
  medium: "h-8 w-8 border-2",
  large: "h-12 w-12 border-3",
}

const LoadingSpinner = ({ size = "medium", className = "" }: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full border-gray-300 border-t-primary animate-spin`} />
    </div>
  )
}

export default LoadingSpinner

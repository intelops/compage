import LoadingOverlay from 'react-loading-overlay'
import BounceLoader from 'react-spinners/BounceLoader'

export const CompageLoader = ({active, children}) => {
    return (
        <LoadingOverlay
            active={active}
            spinner={<BounceLoader/>}
        >
            {children}
        </LoadingOverlay>
    )
}
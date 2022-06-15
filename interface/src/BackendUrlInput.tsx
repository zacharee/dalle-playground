import React, {useEffect, useState} from "react";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {createStyles, Grid, TextField} from "@material-ui/core";
import {isValidURL} from "./utils";
import {PulseLoader} from "react-spinners";
import qs from "qs";
import {checkIfValidBackend} from "./backend_api";

const styles = createStyles({
    inputBackend: {
        minWidth: '220px',
    },
    loadingSpinner: {
        paddingTop: '20px !important',
    }
})

interface Props extends WithStyles<typeof styles> {
    disabled: boolean,
    setBackendValidUrl: (url: string) => void,
    isValidBackendEndpoint: boolean,
    setIsValidBackendEndpoint: (valid: boolean) => void,
    isCheckingBackendEndpoint: boolean,
    setIsCheckingBackendEndpoint: (checking: boolean) => void
}

const BackendUrlInput = ({
                             classes, disabled, setBackendValidUrl,
                             isValidBackendEndpoint, setIsValidBackendEndpoint,
                             isCheckingBackendEndpoint, setIsCheckingBackendEndpoint,
                         }: Props) => {
    const [backendUrl, setBackendUrl] = useState('');

    useEffect(() => {
        const qsBackendUrl = qs.parse(window.location.search, {ignoreQueryPrefix: true}).backendUrl

        if (qsBackendUrl) {
            setBackendUrl(qsBackendUrl.toString())
        }
    })

    useEffect(() => {
        const controller = new AbortController()
        if (backendUrl) {
            if (isValidURL(backendUrl)) {
                setIsCheckingBackendEndpoint(true)
                checkIfValidBackend(backendUrl, controller).then((isValid) => {
                    setIsValidBackendEndpoint(isValid)
                    if (isValid) {
                        setBackendValidUrl(backendUrl)
                    }
                    setIsCheckingBackendEndpoint(false)
                }).catch(() => {
                    setIsCheckingBackendEndpoint(false)
                })
            } else {
                setIsValidBackendEndpoint(false)
            }
        }

        return (() => controller.abort())
    }, [backendUrl, setBackendValidUrl, setIsCheckingBackendEndpoint, setIsValidBackendEndpoint])

    return (
        <Grid container spacing={1} alignContent="center">
            <Grid item xs={isCheckingBackendEndpoint ? 10 : 12}>
                <TextField className={classes.inputBackend} fullWidth id="standard-basic"
                           label="Backend URL" value={backendUrl} disabled={disabled}
                           error={!isValidBackendEndpoint && backendUrl !== ''}
                           helperText={!isValidBackendEndpoint && backendUrl !== '' && "No running DALL-E server with this URL"}
                           onChange={(event) => setBackendUrl(event.target.value)}/>
            </Grid>
            {isCheckingBackendEndpoint && <Grid item className={classes.loadingSpinner} xs={2}>
                <PulseLoader size={5} color="purple"
                             loading={isCheckingBackendEndpoint}/>
            </Grid>}
        </Grid>
    )
}

export default withStyles(styles)(BackendUrlInput);

import React from 'react';
import {createStyles, Grid} from "@material-ui/core";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";

const styles = createStyles({
    generatedImg: {
        borderRadius: '8px',
    },
});

interface Props extends WithStyles<typeof styles> {
    generatedImages: Array<string>,
    promptText: string
}

const GeneratedImageList = ({ classes, generatedImages, promptText }: Props) => {
    const ImageObject = ({ imgData, promptText, index }: { imgData: string, promptText: string, index: number }) => {
        const imgSrc = `data:image/png;base64,${imgData}`
        const alt = `${promptText} ${index}`
        const title= "Download image"
        const downloadedFilename = promptText + "_" + index + ".jpeg"

        return (
            <a href={imgSrc} title={title} download={downloadedFilename}>
                <img src={imgSrc} className={classes.generatedImg} alt={alt} title={title} />
            </a>
        )
    }


    return (
        <Grid container alignItems="center" spacing={3}>
            {generatedImages.map((generatedImg: string, index: number) => {
                return (
                    <Grid item key={index}>
                        <ImageObject imgData={generatedImg} promptText={promptText} index={++index}/>
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default withStyles(styles)(GeneratedImageList)

import type {Attachment} from 'ai';

import {LoaderIcon} from './icons';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

const PreviewImage = ({url, name}: { url: string; name: string | undefined }) => {
    return (
        <img
            src={url}
            alt={name}
            className="rounded-md size-full object-cover"
        />
    );
}

const PreviewPDF = ({name}: { name: string | undefined }) => {
    return (
        <div className="text-2xl text-zinc-500">
            <span className="text-4xl">📄</span>
        </div>
    );
}


export const PreviewAttachment = ({
                                      attachment,
                                      isUploading = false,
                                  }: {
    attachment: Attachment;
    isUploading?: boolean;
}) => {
    const {name, url, contentType} = attachment;

    return (
        <div className="flex flex-col gap-2">
            <div className="w-20 h-16 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
                <Tooltip>
                    <TooltipTrigger>
                        {/* Is PDF? */}
                        {
                            contentType ? (

                                contentType === 'application/pdf' ? (
                                    <PreviewPDF name={name}/>
                                ) : (
                                    <PreviewImage url={url} name={name}/>
                                )
                            ) : (
                                <div className=""/>
                            )
                        }
                    </TooltipTrigger>
                    <TooltipContent align="end">
                        {name}
                    </TooltipContent>
                </Tooltip>
                {isUploading && (
                    <div className="animate-spin absolute text-zinc-500">
                        <LoaderIcon/>
                    </div>
                )}
            </div>
            <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div>
        </div>
    );
};

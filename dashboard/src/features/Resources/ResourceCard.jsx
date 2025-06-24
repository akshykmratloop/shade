// import { Badge } from "@/components/ui/badge";
import { Edit3, Eye, MoreVertical, Globe, Calendar } from "lucide-react";
import NA_Image from "../../assets/na.svg"
import temp from "../../assets/image.png"
import formatTimestamp from "../../app/TimeFormat";
import { useEffect, useRef, useState } from "react";
// import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/breakUI/DropDownMenu";
import { pagesImages } from "./resourcedata";
import { useSelector } from "react-redux";
import capitalizeWords, { TruncateText } from "../../app/capitalizeword";

export const ResourceCard = ({ resource = {}, ActionIcons }) => {
    const isEditor = useSelector(state => state.user.isEditor)
    const isSingleManager = useSelector(state => state.user.isSingleManager)

    console.log(resource)
    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <img
                    src={
                        // temp
                        pagesImages[resource.slug] || NA_Image
                    }
                    alt={resource.name}
                    className={`w-full h-full object-cover ${pagesImages[resource.slug] && "object-top brightness-[0.9]"}`}
                />
                <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                    {
                        (isEditor || isSingleManager) &&
                        <div className="bg-[#f1f5f9] text-black/70 text-sm px-2 py-1 rounded-2xl">
                            {resource.isPublished ? "Published" : resource.newVersionEditMode ? capitalizeWords(resource.newVersionEditMode.versionStatus || "") : "Under Editing"}
                        </div>
                    }
                    {
                        !isEditor &&
                        <div className="bg-[#f1f5f9] text-black/70 text-sm px-2 py-1 rounded-2xl">
                            {resource.isAssigned ? "Assigned" : "Not Assigned"}
                        </div>
                    }
                </div>
            </div>
            {/* Content */}
            <div className="p-4 flex flex-col border  justify-between">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1"
                            title={resource.titleEn}>{TruncateText(resource.titleEn, 25)}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                            {/* <Globe className="w-4 h-4 mr-1" /> */}
                            <span>{resource.status}</span>
                        </div>
                    </div>
                    <div className="relative">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-md rounded-md p-1"
                            >
                                {
                                    !isEditor &&
                                    <DropdownMenuItem
                                        onClick={() => ActionIcons(resource, 2)}
                                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md">
                                        Assign Users
                                    </DropdownMenuItem>}
                                <DropdownMenuItem
                                    onClick={() => ActionIcons(resource, 0)}
                                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md">
                                    Info
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    {/* <Calendar className="w-4 h-4 translate-y-[-2px]" /> */}
                    <span>{formatTimestamp(resource.updatedAt)}</span>
                </div>
                {/* Actions */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => ActionIcons(resource, 1)}
                        className="flex-1 flex items-center justify-center rounded-xl bg-[#29469c] text-[#fff]" size="sm">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                    </button>
                    <button
                        onClick={() => ActionIcons(resource, 3)}
                        variant="outline" className="flex items-center justify-center gap-2 border py-3 px-4 rounded-xl text-[#282828]" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </button>
                </div>
            </div>
        </div >
    );
};
import content from '../content.json'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateContent } from '../../../../common/homeContentSlice';
import { services } from '../../../../../assets/index'

const SubServiceDetails = ({ serviceId, contentOn, language, screen, deepPath }) => {
    const dispatch = useDispatch()
    let pageIndex
    const currentContent = contentOn?.filter(
        (item, i) => {
            if (item?.id == deepPath) pageIndex = i
            return item?.id == deepPath
        }
    )[0];

    console.log(currentContent)

    useEffect(() => {
        dispatch(updateContent({ currentPath: "subOfsubService", payload: content.subOfsubService }))
    }, [])
    return (
        <div>
            {/* banner */}
            <section className='px-[75px] py-[50px]'>
                <article className='flex flex-col gap-[34px]'>
                    <section className='flex gap-[120px]'>
                        <h1 className='text-[35px] w-[346px] grow-1'>{currentContent?.banner?.title?.[language]}</h1>
                        <p className='text-[9.5px] w-[363px]'>{currentContent?.banner?.description?.[language]}</p>
                    </section>
                    <div>
                        <img src={services?.[currentContent?.banner?.image]} alt="" className='w-[834px] aspect-[3.5/1] object-cover' />
                    </div>
                    <section className='flex gap-[120px]'>
                        <h2 className='text-[33px] w-[346px] grow-1 leading-[28px]'>{currentContent?.subBanner?.title?.[language]}</h2>
                        <p className='text-[9.5px] w-[363px]'>{currentContent?.subBanner?.description?.[language]}</p>
                    </section>
                </article>
            </section>

            {/* Services */}
            <section className='px-[75px] py-[20px] grid grid-cols-2 gap-x-[20px] gap-y-[30px]'>
                {
                    currentContent?.descriptions?.map((description, i) => {

                        return (
                            <article className='px-[37px] py-[20px] bg-[#00B9F212]' key={i + description?.title?.[language]}>
                                <h3 className={`text-[25px]`}>{description?.title?.[language]}</h3>
                                <p className={`text-[11px]`}>{description?.description?.[language]}</p>
                            </article>
                        )
                    })
                }
            </section>

            <section>
                <article>
                    {currentContent?.map()}
                </article>
            </section>
        </div>
    )
}

export default SubServiceDetails
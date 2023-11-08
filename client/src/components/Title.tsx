import { Link } from "react-router-dom"

type TitleProps = {
    title: string,
    subtitle: string,
    link: string
}

const Title = ({ title, subtitle, link }: TitleProps) => {
    return (
        <div data-aos="fade-up" className="flex justify-between">
            <div>
                <p className="text-2xl font-semibold">{title}</p>
                <p className="text-gray-400">{subtitle}</p>
            </div>
            <Link aria-label={subtitle} to={link}>
                <button className="text-white border px-6 py-2 rounded-full text-xs hover:text-black hover:bg-white">
                    SEE MORE
                </button>
            </Link>
        </div>
    )
}

export default Title;
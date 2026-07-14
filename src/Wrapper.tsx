type PageProps = {
    component: React.ComponentType
}
export default function MdxWrapper({component: Component}: PageProps) {
    return <Component />
}
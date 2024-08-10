import {useMemo} from "react";
import {useNavigate} from "react-router-dom";

export const useRouter = () => {
    const navigate = useNavigate();

    const router = useMemo(
        () => ({
            back: () => navigate(-1),
            forward: () => navigate(1),
            reload: () => window.location.reload(),
            push: (href: string) => navigate(href),
            replace: (href: string) => navigate(href, {replace: true}),
            replaceWithReload: (href: string) => (window.location.href = href),
        }),
        [navigate],
    );

    return router;
};

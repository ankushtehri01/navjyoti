/** Convenience wrappers around react-redux hooks (single import site). */
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

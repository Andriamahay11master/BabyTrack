import { ReactNode, useId } from 'react';
import './breadcrumb.scss';
import { NavLink } from 'react-router-dom';

export type CrumbItem = {
  label: ReactNode;
  path: string;
};
export type BreadcrumbProps = {
  items: CrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const id = useId();

  return (
    <div className='breadcrumb-container'>
      {items.map((crumb, i) => {
        const isLastItem = i === items.length - 1;
        if (!isLastItem) {
          return (
            <span key={`${id}+${i}`} >
              <NavLink to={crumb.path} key={`${id}+${i}`} className='breadcrumb-link'>
                {crumb.label}
              </NavLink>
              {/* separator */}
              <span className='breadcrumb-separator' key={`${id}-${i}`}> / </span>
            </span>
          );
        } else {
          return (<span  key={`${id}+${i}`} className='breadcrumb-label' >{crumb.label}</span> )
        }
      })}
    </div>
  );
}

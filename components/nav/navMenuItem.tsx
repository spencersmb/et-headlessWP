import { IMenuItem } from '../../hooks/useSite'
import Link from 'next/link';

interface IProps {
  dropDownClassNames?: string
  item: IMenuItem
}

const NavMenuItem = (props: IProps) => {
  const {item, dropDownClassNames} = props

  return(
    <li key={item.id}>
      {!item.path.includes('http') && !item.target && (
        <Link href={item.path}>
          <a title={item.title}>{item.label}</a>
        </Link>
      )}
      {item.path.includes('http') && (
        <a href={item.path} title={item.title} target={item.target} rel="noopener">
          {item.label}
        </a>
      )}

      {/* check for children */}
      {item.childItems && item.childItems.edges.length > 0 &&
      <ul className={dropDownClassNames}>
        {item.childItems.edges.map((item) => {
          return <NavMenuItem key={item.node.id} item={item.node}  />;
        })}
      </ul>
        }
    </li>
  )
}

export default NavMenuItem

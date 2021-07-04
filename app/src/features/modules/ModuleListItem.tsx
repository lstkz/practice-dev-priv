import {
  LocationMarkerIcon,
  UsersIcon,
  ClockIcon,
} from '@heroicons/react/outline';
import tw from 'twin.macro';
import Badge from '../../components/Badge';

interface Module {
  id: number;
  title: string;
  description: React.ReactNode;
  tags: string[];
  solved: number;
  total: number;
}

interface ModuleListItemProps {
  item: Module;
}

export function ModuleListItem(props: ModuleListItemProps) {
  const { item } = props;
  const { solved, total } = item;
  const progress = (solved / total) * 100;
  return (
    <li key={item.id}>
      <a href="#" className="block hover:bg-gray-50">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-medium text-gray-800  truncate">
                {item.title}
              </p>
              <p className="text-sm mt-2 text-gray-600">{item.description}</p>
            </div>
            <div tw="ml-6">
              <div
                css={[
                  tw`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium  md:mt-2 lg:mt-0`,
                  progress === 100
                    ? tw`bg-green-100 text-green-800`
                    : progress < 50
                    ? tw`bg-red-100 text-red-800`
                    : tw`bg-yellow-100 text-yellow-800`,
                ]}
              >
                {solved}/{total}
              </div>
            </div>
          </div>
          <div className="mt-4 ">
            <div className="flex">
              <p className="flex items-center text-sm text-gray-500">
                <UsersIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                250
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <ClockIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                100h
              </p>
            </div>
            <div tw="mt-2 space-x-2">
              {item.tags.map(tag => (
                <Badge key={tag} color="purple">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </a>
    </li>
  );
}

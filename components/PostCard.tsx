
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { PostType } from '../types/Type';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const PostCard = ({ subject, subjectLine, level, board, desc, minFees, maxFees, mode, freeDemo, tutorName, tutorImg, postDate, totalViews }: PostType) => {

    return (
        <View className='mb-4'>
            <View className='bg-gray-200 p-3 mt-2 rounded-lg shadow-md flex-row justify-between'>
                <View className='bg-white p-4 rounded-lg w-[72%] flex-col justify-between'>
                    <View className='flex-row justify-between items-start mb-2'>
                        <View>
                            <Text className='font-bold text-lg'>{subject}</Text>
                            <Text className='text-gray-700'>{subjectLine}</Text>
                        </View>
                        <View>
                            <Text className='text-sm text-gray-500'>{level}</Text>
                            {board ? <Text className='text-sm text-gray-500'>{board}</Text> : null}
                            <Text className='text-sm text-gray-500'>{mode == 'Both' ? 'Online & Offline' : mode}</Text>
                        </View>
                    </View>
                    <View>
                        <Text className='text-gray-700'>{desc}</Text>
                    </View>
                    <View className='text-gray-500 mb-[-10px] mt-2 flex-row justify-between items-center'>
                        <Text className='text-xs'>{`Fees: ${minFees} - ${maxFees} per Hour`}</Text>

                        <View className='flex-row items-center w-12 justify-between bg-gray-300 px-2 rounded-full'>
                            <FontAwesomeIcon icon={faEye} size={12} color={'black'} />
                            <Text className='text-sm text-black'>{totalViews}</Text>
                        </View>
                    </View>
                </View>
                <View className='flex-col justify-between'>
                    <View>
                        <View className='flex-col justify-between items-center mt-2'>
                            <View className="h-12 w-12 bg-gray-100 rounded-full overflow-hidden items-center justify-center">
                                <Image
                                    source={typeof tutorImg === 'string' ? { uri: tutorImg } : tutorImg}
                                    className="h-full w-full"
                                    resizeMode="cover"
                                />
                            </View>
                            <Text className='font-bold text-sm mt-2'>{tutorName}</Text>

                        </View>

                    </View>
                    <View>
                        <Text className='text-sm text-gray-500'>{`Posted ${postDate}`}</Text>
                    </View>
                </View>
            </View>
            {
                freeDemo ? (
                    <View className='bg-blue-100 p-2 pb-1 rounded-b-xl mt-[-5px] z-[-1]'>
                        <Text className='text-blue-800 text-center text-xs font-semibold'>Free Demo Available</Text>
                    </View>
                ) : null
            }
        </View>
    );

}

export default PostCard;
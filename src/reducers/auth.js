export default function auth(state= {auth: false}, action) {
    switch (action.type) {
       case 'IS_AUTHENTICATED':
            return {
                ...state,
                auth: action.payload,
            }
        case 'USER_PROFILE':
            return {
                ...state,
                userProfile: action.payload,
            }
        case 'GROUP_INFO':
            return {
                ...state,
                groupInfo: action.payload,
            }
        case 'GROUP_CREATION':
            return {
                ...state,
                groupCreation: action.payload,
            }
        case 'TRIP_INFO':
            return {
                ...state,
                tripInfo: action.payload,
            }
        case 'FLIGHT_DATA':
            return {
                ...state,
                flightData: action.payload,
            }

        case 'HOTEL_DATA':
            return {
                ...state,
                hotelData: action.payload,
            }
        case 'LOCATION_DATA':
            return {
                ...state,
                locData: action.payload,
            }
        case 'LOCATION_DATA2':
            return {
                ...state,
                locData2: action.payload,
            }

        case 'FILTER_DATA':
            return {
                ...state,
                filtData: action.payload,
            }

        default:
            return state;


    }
  }
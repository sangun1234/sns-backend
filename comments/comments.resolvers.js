

export default {
    Comment: {
        isMine: ({ userId }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
                //loggedInUser가 없을경우엔 아래식만 있으면 에러가 뜨기 때문에 설정
            }
            return userId === loggedInUser.id;
        },
    },
}
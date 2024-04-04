import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
    try {
        if (!token) {
            return null;
        }
        const { id } = await jwt.verify(token, process.env.SECRET_KEY);
        const user = await client.user.findUnique({ where: { id: id } });
        if (user) {
            return user;
        } else {
            return null;
        }

    } catch (e) {
        return null;
    }
};


// protectResolver 함수 정의
export function protectResolver(ourResolver) {
    // 반환되는 함수 정의
    return function (root, args, context, info) {
        // 로그인 여부 확인
        if (!context.loggedInUser) {
            // 사용자가 로그인되어 있지 않으면 오류 메시지와 함께 요청 거부
            return {
                ok: false,
                error: "Please log in",
            };
        }
        // 사용자가 로그인되어 있으면 매개 변수로 받은 리졸버 함수 실행
        return ourResolver(root, args, context, info);
    };
}


//앞으로 기능이 많아질텐데 계속 jwt사용해서 토큰받고 뭐시기 하고
//그카는거 보다 차라리 파일하나 만들어서 user을 받아서
//user을 리턴시키면은 context통해서 아 이유저구나를 알수있게
//하는거다 이거인듯


/* 
결론 : 이런 고차함수는 함수가 함수를 호출해야될때 사용된다.

graphql 서버는 자동적으로 root,args,context,info를 넣어서 실행시킨다. 
따라서 우리는 우리 스스로 리졸버 함수를 만들었다고 보면됨.
그동안 우리가 했던건 정의만해놓고 브라우저에서 콜을 하면 
graphql 서버에서 저렇게 매개변수를 넣어서 실행해줬던건데
지금은 우리가 우리 유저함수를 프로텍팅하기 위해서 함수를 실행
해야되기때문이다.

앞에 매개변수 ourResolver에서 함수를 '정의'하고, 그 후
resolver함수를 이용하여 '실행'!
*/
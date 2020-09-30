from collections import deque
#미로의 세로 가로 갯수 입력받기
n,m = map(int, input().split())
#미로의 정보 입력받기
graph = []
for i in range(n):
    graph.append(list(map(int, input())))
#시작위치 
x,y = (0,0)
start = (0,0)
#방문처리할 리스트 만들기
visited = [[0]*m for _ in range(n)]
#시작위치 방문처리
visited[x][y] = 1

#북 서 남 북 순으로 가는방향 리스트 정의
dx = [0,-1,0,1]
dy = [-1,0,1,0]


def bfs(x,y):
    queue = deque()
    queue.append((x,y))
    #큐가 빌 때까지 반복
    while queue:
        x,y = queue.popleft()
        #현재 위치에서 네 방향으로 위치 확인
        for i in range(4):
            nx = x + dx[i]
            ny = y + dy[i]
            #미로 공간을 벗어날 경우 무시
            if nx < 0 or ny < 0 or nx >= n or ny >= m:
                continue
            #괴물인 경우 무시
            if graph[nx][ny] == 0:
                continue
            #해당 노드를 처음 방문하는 경우
            if graph[nx][ny] == 1:
                graph[nx][ny] = graph[x][y] + 1
                queue.append((nx,ny))
        #가장 오른쪽 아래까지의 최단 거리 반환
    return graph[n-1][m-1]

print(bfs(x,y))


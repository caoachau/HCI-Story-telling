import React from 'react';

export class RecoveryBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null; revision: number }> {
  state = { error: null as Error | null, revision: 0 };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return <section className="hx-recovery" role="alert"><h2>Chưa mở được nội dung · Content unavailable</h2><p>Bạn có thể thử lại. Nội dung đã lưu trên thiết bị vẫn được giữ.</p><p>You can retry without clearing your saved content.</p><button type="button" onClick={() => this.setState(state => ({ error: null, revision: state.revision + 1 }))}>Thử lại / Retry</button><button type="button" onClick={() => location.reload()}>Tải lại trang tại vị trí này / Reload this page</button><a href={new URL('index.html', location.href).href}>Về bản đồ / Back to map</a></section>;
    return <React.Fragment key={this.state.revision}>{this.props.children}</React.Fragment>;
  }
}


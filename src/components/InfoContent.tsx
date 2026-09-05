import {
  ArrowRight,
  BookOpen,
  Code2,
  ExternalLink,
  Headphones,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { product } from '../config/product'

export type InfoTopic = 'support' | 'privacy' | 'terms'

export function InfoContent({
  topic,
  navigate,
}: {
  topic: InfoTopic
  navigate: (id: string) => void
}) {
  if (topic === 'support')
    return (
      <div className="info-content">
        <div className="support-intro">
          <span className="icon-tile peach">
            <Headphones size={25} />
          </span>
          <h3>Mình cùng tìm câu trả lời nhé.</h3>
          <p>Chọn chủ đề bạn cần, để tiếp tục sáng tạo thật dễ dàng.</p>
        </div>
        <button className="support-option" onClick={() => navigate('faq')}>
          <BookOpen size={20} />
          <span>
            <strong>Thông tin gói & câu hỏi thường gặp</strong>
            <small>Credits, thời hạn, đơn nháp và quyền sử dụng</small>
          </span>
          <ArrowRight size={16} />
        </button>
        <button className="support-option" onClick={() => navigate('integration')}>
          <Code2 size={20} />
          <span>
            <strong>Hướng dẫn tích hợp API</strong>
            <small>Ví dụ Node.js, Python và cURL cho backend</small>
          </span>
          <ArrowRight size={16} />
        </button>
        {product.supportEmail ? (
          <a className="support-option" href={`mailto:${product.supportEmail}`}>
            <Mail size={20} />
            <span>
              <strong>Liên hệ người bán</strong>
              <small>{product.supportEmail}</small>
            </span>
            <ArrowRight size={16} />
          </a>
        ) : (
          <div className="support-contact-note">
            <Mail size={16} />
            <p>
              Kênh liên hệ người bán chưa được thiết lập trong bản demo. Chưa gửi yêu cầu hay thực
              hiện thanh toán trên website này.
            </p>
          </div>
        )}
        <a
          className="official-support"
          href="https://elevenlabs.io/help"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trung tâm trợ giúp chính thức của ElevenLabs <ExternalLink size={13} />
        </a>
      </div>
    )

  if (topic === 'privacy')
    return (
      <div className="info-content legal-content">
        <span className="legal-icon">
          <ShieldCheck size={26} />
        </span>
        <p className="legal-date">Thông tin bản xem trước · Cập nhật 05/09/2026</p>
        <h3>Dữ liệu của bạn được xử lý thế nào?</h3>
        <p>
          Website không có hệ thống đăng nhập, không lưu API key và không tích hợp công cụ phân tích
          hay cookie quảng cáo.
        </p>
        <h4>Đơn nháp trên thiết bị</h4>
        <p>
          Thông tin gói, giá minh họa, mã bản nháp và thời gian tạo được lưu trong localStorage của
          trình duyệt, tối đa 30 bản. Bạn có thể xóa từng bản trong “Đơn nháp của tôi” hoặc xóa dữ
          liệu website trong cài đặt trình duyệt. Tên và email trong form chỉ tồn tại trong phiên mở
          cửa sổ; chỉ được ghi vào tệp nếu bạn chủ động tải bản nháp ngay sau khi tạo.
        </p>
        <h4>Văn bản & giọng đọc</h4>
        <p>
          File .txt được đọc trong trình duyệt và không được ứng dụng tải lên máy chủ. Voice Studio
          dùng dịch vụ đọc văn bản của trình duyệt/thiết bị; tùy giọng được cài, trình duyệt có thể
          dùng dịch vụ tổng hợp giọng nói qua mạng. Chính sách của nhà cung cấp giọng đọc sẽ áp
          dụng. Không nhập thông tin nhạy cảm vào bản thử.
        </p>
        <h4>Dịch vụ bên ngoài</h4>
        <p>
          Khi truy cập tài liệu, email hỗ trợ hoặc trang thanh toán bên ngoài, chính sách của dịch
          vụ đó sẽ áp dụng. Website không nhận hay lưu dữ liệu thẻ thanh toán. Nhà cung cấp hosting
          có thể xử lý nhật ký truy cập theo chính sách riêng.
        </p>
      </div>
    )

  return (
    <div className="info-content legal-content">
      <p className="legal-date">Điều kiện của bản xem trước · Cập nhật 05/09/2026</p>
      <h3>Một không gian sáng tạo, minh bạch.</h3>
      <p>
        Voicekey là giao diện cửa hàng độc lập, không phải website chính thức, đối tác được xác nhận
        hay đơn vị đại diện của ElevenLabs. Tên ElevenLabs thuộc chủ sở hữu tương ứng.
      </p>
      <h4>Giá, gói và giao dịch</h4>
      <p>
        Khi không có cổng thanh toán được cấu hình, mọi giá là minh họa và mọi yêu cầu là đơn nháp;
        không có thanh toán, hóa đơn, email giao hàng hay API key được cấp. 10.000 credits trong một
        tháng là cấu hình gói dự kiến, không phải cam kết cấp dịch vụ trong bản demo. Khi mở bán,
        người bán phải công bố chính xác điều kiện kích hoạt, hạn sử dụng, model, hạn mức, hoàn tiền
        và hỗ trợ.
      </p>
      <h4>Quyền sử dụng và phân phối</h4>
      <p>
        Người bán có trách nhiệm xác minh quyền phân phối dịch vụ, điều khoản chia sẻ API key và các
        điều kiện hiện hành của ElevenLabs trước khi bán. Người mua cần xác nhận giấy phép thực tế,
        không mặc định có quyền thương mại hoặc quyền sử dụng bất kỳ giọng nói nào.
      </p>
      <h4>Sử dụng có trách nhiệm</h4>
      <p>
        Chỉ dùng văn bản và giọng nói mà bạn có quyền sử dụng. Không giả mạo, lừa đảo, xâm phạm
        quyền riêng tư hay vi phạm pháp luật. Luôn bảo vệ API key ở backend và tuân thủ giới hạn của
        nhà cung cấp.
      </p>
      <h4>Thanh toán & hoàn tiền</h4>
      <p>
        Bản demo không nhận tiền nên không phát sinh giao dịch hoàn tiền. Khi có trang thanh toán
        thực tế, người bán phải công bố chính sách hoàn tiền và quy trình xử lý sự cố trước khi thu
        tiền.
      </p>
    </div>
  )
}

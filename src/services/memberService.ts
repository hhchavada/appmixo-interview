import { HTTP_STATUS } from '../constants/constants';
import { ApiError } from '../utils/ApiError';
import { getPagination } from '../utils/pagination';
import { MemberRepository } from '../repositories/memberRepository';
import { CreateMemberDto, UpdateMemberDto } from '../interfaces/member.interface';

export class MemberService {
  private memberRepository: MemberRepository;

  constructor() {
    this.memberRepository = new MemberRepository();
  }

  async createMember(data: CreateMemberDto) {
    const existing = await this.memberRepository.findByEmail(data.email);
    if (existing) {
      throw new ApiError('Email already exists', HTTP_STATUS.CONFLICT);
    }

    return await this.memberRepository.create(data);
  }

  async listMembers(page: number, limit: number) {
    const { page: safePage, limit: safeLimit, skip } = getPagination(page, limit);
    const { members, total } = await this.memberRepository.findAll(skip, safeLimit);
    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: members,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1,
      },
    };
  }

  async updateMember(id: string, data: UpdateMemberDto) {
    const updated = await this.memberRepository.updateById(id, data);
    if (!updated) {
      throw new ApiError('Member not found', HTTP_STATUS.NOT_FOUND);
    }
    return updated;
  }

  async deleteMember(id: string) {
    const deleted = await this.memberRepository.deleteById(id);
    if (!deleted) {
      throw new ApiError('Member not found', HTTP_STATUS.NOT_FOUND);
    }
    return deleted;
  }
}


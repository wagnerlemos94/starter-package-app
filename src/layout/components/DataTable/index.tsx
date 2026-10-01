import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	Switch,
	Container,
	Button as Button_M,
	TablePagination
} from "@mui/material";
import Link from "next/link";
import Loading from "@/components/Loading";
import ConfirmModal from '@/components/ConfirmModal';
import { Delete, EditDocument } from "@mui/icons-material";
import Button from "../Button";
import { DataTableProps } from "./types";
import { useDataTable } from "./useDataTable";
import { normalizePage } from "./pagination";


export function DataTable<T extends object>({ columns, data, className, titulo = "", buttonCadastro, resource, loading = false, action, containerProps, getRowKey, pagination }: DataTableProps<T>) {

	const {
		action: {
			handleDeleteClick,
			handleConfirmDelete,
			setConfirmOpenDelete,
			setConfirmOpenStatus,
			handleConfirmStatus,
			setRowsPerPage,
			setPage,
			handleInativarClick,
			hasPermission
		},
		data: {
			modalCancelText,
			modalConfirmText,
			modalTitle,
			modalDescription,
			confirmOpenDelete,
			confirmOpenStatus,
			rowsPerPage,
			page,
		}
	} = useDataTable<T>(
		{ action }
	);

	const pageSize = pagination?.rowsPerPage ?? rowsPerPage;
	const currentPage = pagination?.page ?? normalizePage(page, pageSize, data.length);
	const visibleRows = pagination ? data : data.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
	const readValue = (row: T, key: string | keyof T): unknown => Reflect.get(row, String(key));
	const readRowKey = (row: T, index: number): React.Key => {
		const id = Reflect.get(row, 'id');
		return getRowKey?.(row, index)
			?? (typeof id === 'string' || typeof id === 'number' ? id : currentPage * pageSize + index);
	};

	return (
		<Container maxWidth={'xl'} sx={{ py: { xs: 2, md: 4 } }}>

			<TableContainer
				component={Paper}
				className={className}
				{...containerProps}
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100%',
					padding: { xs: 2, sm: 3, md: 4 },
					borderRadius: 3,
					border: '1px solid #E5E7EB',
					boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
					...containerProps?.sx,
				}}
			>
				<Box sx={{ marginTop: 0, marginBottom: 2 }}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<div>
							<h1 style={{ margin: 0, padding: 0 }}>{titulo}</h1>
						</div>
						<div>
							{buttonCadastro && hasPermission(resource, 'CREATE') && (
								<Link href={buttonCadastro.redirect ?? "#"} style={{ textDecoration: 'none' }}>
									<Button
										nome={buttonCadastro.nome}
										onClick={buttonCadastro.onChange}
										icon={buttonCadastro.icon}
									/>
								</Link>
							)}
						</div>
					</div>
				</Box>
				<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
					<Table sx={{ width: '100%', flex: 1, height: '100%' }}>
						<TableHead sx={{ backgroundColor: "#F8FAFC" }}>
							<TableRow>
								{columns.map((col) => (
									<TableCell key={String(col.key)}>{col.label}</TableCell>
								))}
								{action && (hasPermission(resource, 'UPDATE') || hasPermission(resource, 'DELETE')) && (
									<TableCell key="actions">Ações</TableCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{data.length === 0 ? (
								<TableRow style={{ height: '60vh' }}>
									<TableCell colSpan={columns.length + (action ? 1 : 0)} align="center" style={{ height: '60vh', verticalAlign: 'middle' }}>
										Nenhum dado encontrado
									</TableCell>
								</TableRow>
							) : (
								visibleRows.map((row: T, idx) => (
									<TableRow key={readRowKey(row, idx)} hover>
										{columns.map((col) => (
											<TableCell key={String(col.key)}>
												{col.render ? col.render(readValue(row, col.key), row) : String(readValue(row, col.key) ?? '')}
											</TableCell>
										))}
										{action && (hasPermission(resource, 'UPDATE') || hasPermission(resource, 'DELETE')) && (
											<TableCell>
												{action.edit && hasPermission(resource, 'UPDATE') && (
													<Button_M disabled={action.edit.disabled?.(row)} size="small" color="primary" onClick={() => action?.edit?.onChange(row)}><EditDocument fontSize="small" /></Button_M>
												)}
												{action.status && hasPermission(resource, 'UPDATE') && (
													<Button_M disabled={action.status.disabled?.(row)} size="small" onClick={() => handleInativarClick(row)}><Switch color="success" checked={action.status.checked(row)}></Switch></Button_M>
												)}
												{action.delete && hasPermission(resource, 'DELETE') && (
													<Button_M disabled={action.delete.disabled?.(row)} size="small" color="error" onClick={() => handleDeleteClick(row)}><Delete fontSize="small" /></Button_M>
												)}
											</TableCell>
										)}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</Box>
				<Loading isLoading={loading} />

				<ConfirmModal
					open={confirmOpenDelete}
					setOpen={setConfirmOpenDelete}
					title={modalTitle}
					description={modalDescription}
					confirmText={modalConfirmText}
					cancelText={modalCancelText}
					onConfirm={handleConfirmDelete}
				/>
				<ConfirmModal
					open={confirmOpenStatus}
					setOpen={setConfirmOpenStatus}
					title={'Confirmar alteração de status'}
					description={'Deseja realmente alterar o status deste item?'}
					confirmText={'Alterar'}
					cancelText={'Cancelar'}
					onConfirm={handleConfirmStatus}
				/>
				<TablePagination
					rowsPerPageOptions={[10, 25, 50]}
					component="div"
					count={pagination?.totalElements ?? data.length}
					rowsPerPage={pageSize}
					page={currentPage}
					onPageChange={(_event, nextPage) => { if (pagination) pagination.onPageChange(nextPage); else setPage(nextPage); }}
					onRowsPerPageChange={(event) => {
						if (pagination) { pagination.onRowsPerPageChange(parseInt(event.target.value, 10)); return; }
						setRowsPerPage(parseInt(event.target.value, 10));
						setPage(0);
					}}
				/>
			</TableContainer>
		</Container>
	);
}

export default DataTable;
